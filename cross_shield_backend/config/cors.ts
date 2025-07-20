// // const corsConfig = {
// //   origin: (origin: string | null) => {
// //     const allowedOrigins = [
// //       'http://localhost:3000',
// //       'http://localhost:5173',
// //       'http://localhost:8080',
// //       'https://vhal-ente.github.io',
// //     ]

// //     if (!origin) return true
// //     return allowedOrigins.includes(origin)
// //   },
// //   credentials: true,
// //   methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'PATCH'],
// //   headers: true,
// //   exposeHeaders: [
// //     'cache-control',
// //     'content-language',
// //     'content-type',
// //     'expires',
// //     'last-modified',
// //     'pragma',
// //   ],
// //   maxAge: 90,
// // }

// // export default corsConfig

// const corsConfig = {
//   origin: (
//     origin: string | null,
//     callback: (err: Error | null, allow?: boolean | string) => void
//   ) => {
//     const allowedOrigins = [
//       'http://localhost:3000',
//       'http://localhost:5173',
//       'http://localhost:8080',
//       'https://vhal-ente.github.io',
//     ]

//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, origin || true) // Allow
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   },
//   credentials: true,
//   methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'PATCH'],
//   allowedHeaders: ['Content-Type', 'Authorization'], // add necessary headers here
//   exposedHeaders: [
//     'cache-control',
//     'content-language',
//     'content-type',
//     'expires',
//     'last-modified',
//     'pragma',
//   ],
//   maxAge: 90,
// }
// export default corsConfig

// config/cors.ts
import type { CorsConfig } from '@adonisjs/cors/types'

const corsConfig: CorsConfig = {
  enabled: true,
  origin: (origin: string | undefined) => {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:8080',
      'https://vhal-ente.github.io',
    ]

    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return true

    return allowedOrigins.includes(origin)
  },
  methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'PATCH'],
  headers: true,
  exposeHeaders: [
    'cache-control',
    'content-language',
    'content-type',
    'expires',
    'last-modified',
    'pragma',
  ],
  credentials: true,
  maxAge: 90,
}

export default corsConfig
