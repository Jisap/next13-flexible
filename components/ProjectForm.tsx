"use client"

import Image from 'next/image';
import React, { ChangeEvent, FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation';


import Button from './Button';
import CustomMenu from './CustomMenu';
import { categoryFilters } from '@/constant';
import { updateProject, createNewProject, fetchToken } from '@/lib/actions';
import { FormState, ProjectInterface, SessionInterface } from '@/common.types';


type Props = {
  type: string,
  session: SessionInterface,
  project?: ProjectInterface
}


const ProjectForm = ({ type, session }:Props) => {
  return (
    
    <div>ProjectForm</div>
  )
}

export default ProjectForm