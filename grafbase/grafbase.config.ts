import { g, auth, config } from '@grafbase/sdk'

// @ts-ignore
const User = g.model('User', {
  name: g.string().length({ min: 2, max: 100 }),
  email: g.string().unique(),
  avatarUrl: g.url(),
  description: g.string().length({ min: 2, max: 1000 }).optional(),
  githubUrl: g.url().optional(),
  linkedInUrl: g.url().optional(),
  projects: g.relation(() => Project).list().optional(), // Un usuario puede tener multiples proyectos
}).auth((rules) => {
  rules.public().read() // Cualquiera podrá leer los usuarios de la bd
})

// @ts-ignore
const Project = g.model('Project', {
  title: g.string().length({ min: 3 }),
  description: g.string(),
  image: g.url(),
  liveSiteUrl: g.url(),
  githubUrl: g.url(),
  category: g.string().search(),
  createdBy: g.relation(() => User), // Cada proyecto es creado por un usuario
}).auth((rules) => {
  rules.public().read()                       // Se podrán consultar los proyectos por cualquiera
  rules.private().create().delete().update()  // pero no crear, borrar o actualizar, solo los autores.
})

const jwt = auth.JWT({
  issuer: 'grafbase',
  secret: g.env('NEXTAUTH_SECRET')
})

export default config({
  schema: g,
  auth:{
    providers: [jwt],
    rules: (rules) => rules.private(),
  }
  
})
