//Login API response
export interface LoginResponse {
  refreshToken: string;
  accessToken: string;
}
//Auth me api response
export interface AuthMeResponse {
    id: string
    email: string,
    firstName: string,
    lastName: string,
    image: string,
    quota: number,
    usedSpace: number,
    plan: string,
    birthDate: string | null,
    role: string,
    emailVerified: boolean,
    createdAt: string,
    updatedAt: string,
    session: string,
    iat: number,
    exp: number
}
//Login Request
export interface LoginRequest {
  email: string;
  password: string;
}
//Sign up request
export interface SignupRequest {
  email: string;
  password: string;
  passwordConfirmation: string;
  firstName: string;
  lastName: string;
}
//Pdf listing class
export interface PdfListDetails {
  id: string,
  title: string,
  description: string,
  publishedOn: null,
  rating: number,
  readPage: number,
  totalPages: null,
  authorId: string,
  userId: string,
  tagIds: [],
  createdAt: string,
  updatedAt: string,
  author: {
      id: string,
      name: string,
      image: string,
      userId: string,
      createdAt: string,
      updatedAt: string
  },
  tags: [],
  assets: [
      {
          id: string,
          name: string,
          url: string,
          size: number,
          mimetype: string,
          bucket: string,
          docId: string,
          userId: string,
          createdAt: string,
          updatedAt: string
      }
  ]
}

//Pdf listing class
export interface UpdatePdfDetails {
  title: string,
  description: string,
  rating: number
}