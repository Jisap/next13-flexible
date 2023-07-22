"use client"

import Image from 'next/image';
import React, { ChangeEvent, FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation';


import FormField from './FormField';
import Button from './Button';
import CustomMenu from './CustomMenu';
import { categoryFilters } from '@/constants';
//import { updateProject, createNewProject, fetchToken } from '@/lib/action';
import { FormState, ProjectInterface, SessionInterface } from '@/common.types';
import { createNewProject, fetchToken, updateProject } from '@/lib/action';


type Props = {
  type: string,
  session: SessionInterface,
  project?: ProjectInterface
}


const ProjectForm = ({ type, session, project }:Props) => {

  const router = useRouter();

  const [submitting, setSubmitting] = useState<boolean>(false);

  const [form, setForm] = useState<FormState>({
    title: project?.title || "",
    description: project?.description || "",
    image: project?.image || "",
    liveSiteUrl: project?.liveSiteUrl || "",
    githubUrl: project?.githubUrl || "",
    category: project?.category || ""
  })

  const handleFormSubmit = async(e:FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const { token } = await fetchToken();

    try {
      if (type === "create") {
        await createNewProject(form, session?.user?.id, token)
        router.push("/")
      }
      if (type === "edit") {
        await updateProject(form, project?.id as string, token)
        router.push("/")
      }
    } catch (error) {
      alert(`Failed to ${type === "create" ? "create" : "edit"} a project. Try again!`);
    }finally{
      setSubmitting(false)
    }
  }


  const handleChangeImage = ( e:ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files?.[0];

    if(!file) return;

    if(!file.type.includes('image')){
      return alert('Please upload an image file');
    }

    const reader = new FileReader(); // Instancia lector

    reader.readAsDataURL(file);      // leemos el contenido del file como una url de datos

    reader.onload = () => {
      const result = reader.result as string; // Cuando la lectura del archivo se completa, se obtiene la URL de datos (url con la imagen codificada indicando su ubicación)
      handleStateChange("image", result);     // Modifica el estado de Form
    };
  };
  
  const handleStateChange = (fieldName: string, value: string) => { // Añade al estado del form el nuevo valor del campo que cambia
    setForm((prevForm) => ({...prevForm, [fieldName]:value}))
  };

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

      <FormField
        title='Description'
        state={form.description}
        placeholder="Showcase and discover remarkable developer projects."
        isTextArea
        setState={(value) => handleStateChange('description', value)}
      />

      <FormField
        type="url"
        title="Website URL"
        state={form.liveSiteUrl}
        placeholder="https://jsmastery.pro"
        setState={(value) => handleStateChange('liveSiteUrl', value)}
      />

      <FormField
        type="url"
        title="GitHub URL"
        state={form.githubUrl}
        placeholder="https://github.com/adrianhajdin"
        setState={(value) => handleStateChange('githubUrl', value)}
      />

      <CustomMenu
        title="Category"
        state={form.category}
        filters={categoryFilters}
        setState={(value) => handleStateChange('category', value)}
      />

      <div className="flexStart w-full">
        <Button
          title={submitting                                   // Si submitting es verdadera:
            ? `${type === "create" ? "Creating" : "Editing"}` // Si type = "create", el título del botón será "Creating". Si el type es diferente pondrá Editing
            : `${type === "create" ? "Create" : "Edit"}`      // Si submitting = falso y el type = "create el título será "Create". Si el type es diferente pondrá Edit.
          }
          type="submit"
          leftIcon={submitting ? "" : "/plus.svg"}
          submitting={submitting}
        />
      </div>

    </form>
  )
}

export default ProjectForm