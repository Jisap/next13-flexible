

export const getUserQuery = `
    query GetUser($email: String!){
        user(by: {email: $email}){
            id
            name
            avatarUrl
            description
            githubUrl
            linkedInUrl
        }
    }
`
export const createUserMutation = `
    mutation CreateUser($input: UserCreateInput!){
        userCreate(input: $input){
            user{
                name
                email
                avatarUrl
                description
                githubUrl
                linkedInUrl
                id
            }
        }
    }
`
export const createProjectMutation = `
	mutation CreateProject($input: ProjectCreateInput!) {
		projectCreate(input: $input) {
			project {
				id
				title
				description
				createdBy {
					email
					name
				}
			}
		}
	}
`;