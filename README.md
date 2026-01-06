Project CRUD {
  database_type: 'SQLite'
  Note: 'Su dung Prisma ORM. Column Type theo Prisma'
}

Table User {
  id          Int          [pk, increment]
  email       String       [unique]
  name        String
  password    String
  createdAt   DateTime     [default: `now()`]
  updatedAt   DateTime     [note: '@updatedAt']
}

Table Post {
  id          Int          [pk, increment]
  title       String       
  content     String
  authorId    Int [ref: > User.id, delete: cascade, update: no action] // Khi xoa nguoi dung thi xoa het post cua nguoi do
  createdAt   DateTime     [default: `now()`]
  updatedAt   DateTime     [note: '@updatedAt']
}

Table RefreshToken {
  token       String       [unique]
  userId      Int [ref: > User.id, delete: cascade, update: no action] // Khi xoa nguoi dung thi xoa het token cua nguoi do
  expiresAt   DateTime     
  createdAt   DateTime     [default: `now()`]
}