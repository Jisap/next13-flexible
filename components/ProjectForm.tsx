"use client"

import Image from 'next/image';
import React, { ChangeEvent, FormEvent, useState } from 'react'
import { useRouter, redirect } from 'next/navigation';


import Button from './Button';
import CustomMenu from './CustomMenu';
import { categoryFilters } from '@/constants';
//import { updateProject, createNewProject, fetchToken } from '@/lib/action';
import { FormState, ProjectInterface, SessionInterface } from '@/common.types';
import FormField from './FormField';


type Props = {
  type: string,
  session: SessionInterface,
  project?: ProjectInterface
}


const ProjectForm = ({ type, session }:Props) => {
  
  const handleFormSubmit = (e:FormEvent) => {}
  const handleChangeImage = ( e:ChangeEvent<HTMLInputElement>) => {}
  const handleStateChange = (fieldName: string, value: string) => {}
  
  const form = {
    image:'',
    title:'',
  }

  return (
    
    <form
      onSubmit={handleFormSubmit}
      className='flexStart form'
    >
     <div className='flexStart form_image-container'>
      <label htmlFor="poster" className='flexCenter form_image-label'>
        { !form.image && 'Choose a poster for your project' }
      </label>
      <input 
        id='image'
        type='file'
        accept='image/*'
        required={ type === 'create' ? true : false }
        className='form_image-input'
        onChange={handleChangeImage}
      />
      { form.image && (
        <Image 
          src={form?.image }
          className='sm:p-10 object-contain z-20'
          alt='project-poster'
          fill
        />
      )}
     </div>

      <FormField 
        title="Title"
        state={form.title}
        placeholder="Flexible"
        setState={(value) => handleStateChange('title', value)}
      />

    </form>
  )
}

export default ProjectForm