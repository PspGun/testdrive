'use client'

import React, { useState } from "react";
import axios from "axios";
require( 'dotenv' ).config()

export default function Home ()
{
  //set states
  const [ uploading, setUploading ] = useState( false );
  const [ selectImage, setselectImage ] = useState( "" );
  const [ selectFile, setselectFile ] = useState<File>();

  // function upload image call backend
  const handleUpload = async () => 
  {
    setUploading( true );
    try
    {
      if ( !selectFile ) return;
      const formData = new FormData();
      formData.append( "file", selectFile );
      const { data } = await axios.post( 'http://localhost:8000/api/upload', formData );
      console.log( data );
    } catch ( error: any )
    {
      console.log( error.response?.data );
    }
    setUploading( false );
  };
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
          onChange={ ( { target } ) =>
          {
            if ( target.files )
            {
              const file = target.files[ 0 ];
              setselectImage( URL.createObjectURL( file ) );
              setselectFile( file );
            }
          } }
        />
        <div className="w-40 aspect-video rounded flex items-center justify-center border-2 border-dashed cursor-pointer">
          { selectImage ? (
            <img src={ selectImage } alt="" />
          ) : (
            <span>Select Image</span>
          ) }
        </div>

        <button
          onClick={ handleUpload }
          disabled={ uploading }
          style={ { opacity: uploading ? ".5" : "1" } }
          className="bg-red-600 p-3 w-32 text-center rounded text-white"
        >
          { uploading ? "Uploading.." : "Upload" }
        </button>
        <button >Select File</button>
      </div>
    </main >
  )
}
