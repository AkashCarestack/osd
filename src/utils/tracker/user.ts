import { getCookie, setCookie } from "./cookie";
// import supabase from "./client";

/**
 *  Checks cookies and if not exist creates new User
 * @returns userId
 */
// export const initialize=async()=>{
//   if(!getCookie('__cs_pv')){
//     const userId = await createUser();
//     // setCookie('__cs_pv',userId,365);
//     return {userId}
//   }else{
//     return {userId:getCookie('__cs_pv')}
//   }

// }

export interface IUser {
  browser: string;
  location: string;
  practice_name: string;
  meta: {
    [key: string]: any;
  };
  [key: string]: any;
}

// Creates user with details of browser,location,practice
export async function generateUserData(
  browserData: any
): Promise<Partial<IUser> | undefined> {
  try {
    if (!getCookie("__cs_pv")) {
      const browser = browserData.browser.name;
      const location = await getLocationByIP();
      const url = new URL(window.location.href);
      const params = new URLSearchParams(url.href);
      const practice_name = params.get("domain") ?? "";
      const body = {
        browser,
        location: location?.name,
        practice_name,
        ip_address: location?.data.ip,
        meta: { browserData, location, path: window.location.href },
      };
      return body;
    }
  } catch (error) {
    // Error handled silently
  }
}

export async function storeUser(id: string) {
  setCookie("__cs_pv", id, 365 * 24 * 60 * 60 * 1000);
}

export const getUser = () => getCookie("__cs_pv");

export async function getLocationByIP() {
  try {
    const response = await fetch("/api/geo");
    const data = await response.json();
    const location = `${data.city}, ${data.region}, ${data.country}`;
    return { name: location, data };
  } catch (error) {
    console.error("Error fetching location:", error);
  }
}
