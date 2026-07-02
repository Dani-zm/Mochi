import { supabase } from "../supabase/client";
import { LoginData, RegisterData } from "../types/Usuario";


// Registrar usuario
export async function registerUser(
    data:RegisterData
){

    const {data:user,error}=

    await supabase.auth.signUp({

        email:data.email,

        password:data.password,

        options:{
            data:{
                nombre:data.nombre
            }
        }

    });


    if(error)
        throw error;


    return user;

}



// Iniciar sesión

export async function loginUser(
    data:LoginData
){

    const {data:user,error}=

    await supabase.auth.signInWithPassword({

        email:data.email,

        password:data.password

    });


    if(error)
        throw error;


    return user;

}



// Cerrar sesión

export async function logoutUser(){

    const {error}=

    await supabase.auth.signOut();


    if(error)
        throw error;

}



// Obtener usuario actual

export async function currentUser(){

    const {
        data
    } = await supabase.auth.getUser();


    return data.user;

}

export const AuthService = {
  register: async (nombre: string, email: string, password: string) => {
    return await registerUser({ nombre, email, password });
  },
  login: async (email: string, password: string) => {
    return await loginUser({ email, password });
  },
  logout: async () => {
    return await logoutUser();
  },
  currentUser: async () => {
    return await currentUser();
  }
};

export default AuthService;
