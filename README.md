# Application

 This is for the global template, it leverages the latest technology:

  Tech Stack:

    - Latest NextJs - For ...
    - Latest React
    - ShadCn - Simplify Frontend UI library
    - Accernity - 3D Frontend UI library
    - Cypress - For Testing
    - Supabase - For serverless database
    - Prisma - For ... ORM

 Note:
    - When installing you may use ```pnpm add PACKAGE_HERE --force```  to force install the package

## Todo

- Supabase - For serverless database
- Prisma - For ... ORM
- Apply the [tracing beam](https://ui.aceternity.com/components/tracing-beam) on the sidebar

## Documentation

 1. Force in JSON

    Do not mind this, soon we can remove this for much stable React. Other packages are not moving to this version of React.

    ```json
    "pnpm": {
      "peerDependencyRules": {
        "allowedVersions": {
          "react": "19.0.0-rc-02c0e824-20241028",
          "react-dom": "19.0.0-rc-02c0e824-20241028",
          "@types/react": "^18.0.0",
          "@types/react-dom": "^18.0.0"
        }
      }
    }
    ```
  
 2. Icons

    Use tabler or the Icons from custom library we have which utilize the custom svg and Lucid-React.

    ```bash
    pnpm add @tabler/icons-react
    ```

    Note: The tabler, is not yet implemented.

## References

- [NextJs](https://nextjs.org/)
- [ShadCn](https://github.com/shadcn/ui)
- [Accernity](https://github.com/accernity/accernity)
- [Cypress](https://www.cypress.io/)
- [Supabase](https://supabase.io/)
- [Prisma](https://www.prisma.io/)
- [React 19](https://ui.shadcn.com/docs/react-19) helper
- Usage Guide for Latest [EsLint](https://eslint.org/docs/latest/) 9.13.0
- Next JS [Project Structure](https://nextjs.org/docs/14/getting-started/project-structure)
- Pages you can [play](https://v0.dev/t/uXQxrQJiBgM)
- Lottie [Integration](https://medium.com/@surksha8/render-animation-from-json-file-using-lottie-web-libarary-in-nextjs-ab18fb628e82)
