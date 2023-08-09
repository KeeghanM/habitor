import { connect } from '@planetscale/database'

const config = {
  host: import.meta.env.DATABASE_HOST,
  username: import.meta.env.DATABASE_USERNAME,
  password: import.meta.env.DATABASE_PASSWORD
}

export const DB = await connect(config)
