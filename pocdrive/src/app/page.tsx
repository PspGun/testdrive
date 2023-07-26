'use client'
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import ReactCrop, { Crop, PixelCrop, convertToPixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import resizeImage from "./resize";
import { log } from "console";
import { canvasPreview } from "./preview";
import blobToFile from "./dataURItoBlob";
import dataURItoBlob from "./dataURItoBlob";

// import resizeImage from "./resize";
require( 'dotenv' ).config()

export default function Home ()
{
  //set states
  const previewCanvasRef = useRef<HTMLCanvasElement>( null )
  const imgRef = useRef<HTMLImageElement>( null )
  const [ uploading, setUploading ] = useState( false );
  const [ selectImage, setselectImage ] = useState( "" );
  const [ selectFile, setselectFile ] = useState<File>();
  const [ completedCrop, setCompletedCrop ] = useState<PixelCrop>()
  const [ crop, setCrop ] = useState<Crop>( { unit: 'px', width: 500, height: 500, x: 25, y: 25 } );
  const [ aspect, setAspect ] = useState<number | undefined>( 16 / 9 )

  const handleFileChange = async ( event: React.ChangeEvent<HTMLInputElement> ) =>
  {
    const target = event.target as HTMLInputElement;
    if ( target.files && target.files.length > 0 )
    {
      const file = target.files[ 0 ];

      // Set the selected file for cropping
      setselectFile( file );
      setselectImage( URL.createObjectURL( file ) );
    }
  };

  useEffect(
    () =>
    {
      console.log( completedCrop?.width, completedCrop?.height );
      console.log( imgRef.current );
      console.log( previewCanvasRef.current );

      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      )
      {
        // We use canvasPreview as it's much faster than imgPreview.
        canvasPreview(
          imgRef.current,
          previewCanvasRef.current,
          completedCrop,
          1,
          0,
        )
      }

    },
    [ completedCrop, 1, 0 ],
  )
  function centerAspectCrop (
    mediaWidth: number,
    mediaHeight: number,
    aspect: number,
  )
  {
    return centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        aspect,
        mediaWidth,
        mediaHeight,
      ),
      mediaWidth,
      mediaHeight,
    )
  }

  const handleCropComplete = async ( croppedArea: Crop, croppedAreaPixels: Crop ) =>
  {
    if ( selectFile )
    {

      // Crop and resize the image based on the selected area
      const resizedBlob = await resizeImage( selectFile, 500, 500, crop );
      setCrop( { unit: 'px', width: 500, height: 500, x: 25, y: 25 } );
      setselectImage( URL.createObjectURL( resizedBlob ) );
      setselectFile( new File( [ resizedBlob ], selectFile.name, { type: selectFile.type } ) );
    }
  };

  // useEffect( () =>
  // {
  //   console.log( crop )
  // }, [ crop ] )



  // function upload image call backend
  const handleUpload = async () => 
  {
    setUploading( true );
    try
    {
      if ( !selectFile ) return;
      if ( !previewCanvasRef.current ) return;
      var dataURL = previewCanvasRef.current.toDataURL( 'image/jpeg', 0.5 );
      var blob = dataURItoBlob( dataURL );
      // var blob = blobToFile( dataURL, "watdee.jpeg" );
      const pic = URL.createObjectURL( blob );
      const formData = new FormData();
      formData.append( "file", pic );
      const { data } = await axios.post( 'http://localhost:8000/api/upload', formData );
      console.log( data );
    } catch ( error: any )
    {
      console.log( error.response?.data );
    }
    setUploading( false );
  };
  function dataURLToBlob ( dataUrl: string )
  {
    throw new Error( "Function not implemented." );
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="z-10 w-full max-w-5xl items-center  font-mono text-sm lg:flex">
        {/* <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Get started by editing&nbsp;
          <code className="font-mono font-bold">src/app/page.tsx</code>
        </p> */}

        <input
          type="file"
          multiple accept="image/*"
          onChange={ handleFileChange }
        />
        <div className="topbar aspect-video rounded flex items-center justify-center border-2 border-dashed cursor-pointer">
          { selectImage ? (
            <ReactCrop
              crop={ crop }
              onChange={ ( newCrop ) => setCrop( newCrop ) }
              onComplete={ ( c ) => setCompletedCrop( c ) }
            >
              <img ref={ imgRef } src={ selectImage } alt="" />
            </ReactCrop>
          ) : (
            <span>Select Image</span>
          ) }
        </div>

        { !!completedCrop && (
          <>
            <div>
              <canvas
                ref={ previewCanvasRef }
                style={ {
                  border: '1px solid black',
                  objectFit: 'contain',
                  width: completedCrop.width,
                  height: completedCrop.height,
                } }
              />
            </div>
          </>
        ) }
        <button
          onClick={ handleUpload }
          disabled={ uploading }
          style={ { opacity: uploading ? ".5" : "1" } }
          className="bg-red-600 p-3 w-32 text-center rounded text-white"
        >
          { uploading ? "Uploading.." : "Upload" }
        </button>
      </div>

    </main >
  )
}

