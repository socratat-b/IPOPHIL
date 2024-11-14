// src\lib\faker\users\seed.ts
import * as fs from 'fs'
import * as path from 'path'
import { faker } from '@faker-js/faker'

import { user_status, user_types } from './data'

const users = Array.from({ length: 100 }, () => ({
    id: `${faker.number.int({ min: 1000, max: 9999 })}`,
    department_id: `${faker.number.int({ min: 1000, max: 9999 })}`,
    username: faker.internet.displayName(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    role: faker.helpers.arrayElement(user_types).value,
    title: faker.person.jobTitle(),
    address: faker.address.streetAddress(),
    status: faker.helpers.arrayElement(user_status).value,
    profile_url: faker.image.avatar(),
    created_at: faker.date.past().toISOString(),
    updated_at: faker.date.recent().toISOString(),
}))

fs.writeFileSync(
    path.join(__dirname, 'users.json'),
    JSON.stringify(users, null, 2)
)

console.log('✅ Users data generated.')

/**
 * mar note:
 * 
 * > Compile the script with `tsc seed.ts`.
 * > Run the compiled script with `node seed`.
 * 
 * on the package json:
 * > now you can just run `pnpm seed:all` to generate the data
 */