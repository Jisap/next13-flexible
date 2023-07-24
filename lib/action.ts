import { GraphQLClient } from "graphql-request";
import { createProjectMutation, createUserMutation, deleteProjectMutation, getProjectByIdQuery, getProjectsOfUserQuery, getUserQuery, projectsQuery, updateProjectMutation } from "@/graphql";
import { ProjectForm } from "@/common.types";

const isProduction = process.env.NODE_ENV === 'production';
const apiUrl = isProduction ? process.env.NEXT_PUBLIC_GRAFBASE_API_URL || '' : 'http://127.0.0.1:4000/graphql';
const apiKey = isProduction ? process.env.NEXT_PUBLIC_GRAFBASE_API_KEY || '' : 'letmein';
const serverUrl = isProduction ? process.env.NEXT_PUBLIC_SERVER_URL : 'http://localhost:3000';

const client = new GraphQLClient( apiUrl ); //1

const makeGraphQLRequest = async( query: string, variables = {} ) => { //2

    try {
        return await client.request( query, variables )
    } catch (error) {
        throw error
    }
}

export const getUser = (email: string) => { //3
    client.setHeader("x-api-key", apiKey);
    return makeGraphQLRequest(getUserQuery, { email })
}

export const createUser = (name:string, email:string, avatarUrl:string) => {
    client.setHeader("x-api-key", apiKey);
    const variables = {
        input: {
            name: name,
            email: email,
            avatarUrl: avatarUrl
        },
    };
    return makeGraphQLRequest(createUserMutation, variables);
}

export const uploadImage = async (imagePath: string) => { // Se recibe la ubicación de la imagen 
    try {
        const response = await fetch(`${serverUrl}/api/upload`, {   // Petición de subida de la imagena cloudinary  a través de la api de next
            method: "POST",
            body: JSON.stringify({
                path: imagePath,
            }),
        });
        return response.json();
    } catch (err) {
        throw err;
    }
};

export const createNewProject = async (form: ProjectForm, creatorId: string, token: string ) => { // Creación de un nuevo proyecto
    const imageUrl = await uploadImage(form.image);

    if (imageUrl.url) {
        client.setHeader("Authorization", `Bearer ${token}`);

        const variables = {
            input: {
                ...form,
                image: imageUrl.url,
                createdBy: {
                    link: creatorId
                }
            }
        };

        return makeGraphQLRequest(createProjectMutation, variables);
    }
}

export const fetchToken = async () => {
    try {
        const response = await fetch(`${serverUrl}/api/auth/token`);
        return response.json();
    } catch (err) {
        throw err;
    }
};

export const fetchAllProjects = (category?: string | null, endcursor?: string | null) => {
    console.log("category", category)
    client.setHeader("x-api-key", apiKey);

    return makeGraphQLRequest(projectsQuery, { category, endcursor });
};

export const getProjectDetails = (id: string) => {
    client.setHeader("x-api-key", apiKey);
    return makeGraphQLRequest(getProjectByIdQuery, { id });
};

export const getUserProjects = (id: string, last?: number) => {
    client.setHeader("x-api-key", apiKey);
    return makeGraphQLRequest(getProjectsOfUserQuery, { id, last });
};

export const deleteProject = (id: string, token: string) => {
    client.setHeader("Authorization", `Bearer ${token}`);
    return makeGraphQLRequest(deleteProjectMutation, { id });
};

export const updateProject = async (form: ProjectForm, projectId: string, token: string) => {
    
    function isBase64DataURL(value: string) {
        const base64Regex = /^data:image\/[a-z]+;base64,/;
        return base64Regex.test(value);
    }

    let updatedForm = { ...form };                           // Copia del formulario existente

    const isUploadingNewImage = isBase64DataURL(form.image); // Comprobamos si la imagen esta siendo cargada en el formulario como una url de datos

    if (isUploadingNewImage) {
        const imageUrl = await uploadImage(form.image);      // Esta nueva imagen se sube a cloudinary    

        if (imageUrl.url) {
            updatedForm = { ...updatedForm, image: imageUrl.url }; // y con ella se actualiza la copia del formulario
        }
    }

    client.setHeader("Authorization", `Bearer ${token}`);          // Establecemos si tenemos autenticación (usuario logueado)

    const variables = {                                            // Establecemos el contenido a actualizar
        id: projectId,
        input: updatedForm,
    };

    return makeGraphQLRequest(updateProjectMutation, variables);    // Actualizamos en Bd el formulario
};

