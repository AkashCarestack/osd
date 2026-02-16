import { useDevice, useTracking } from "cs-tracker";
import { getDeviceData } from "cs-tracker";
import { useRouter } from "next/router";
import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";

import { getParams } from "~/helpers/getQueryParams";

import { eraseCookie, getCookie } from "./cookie";
import { createObservableObject, proxyDecode } from "./observer";
import { getInitialSession, getSession, storePracticeName, storeSession } from "./session";
import { generateUserData, getLocationByIP, getUser, IUser, storeUser } from "./user";

export const createSession = async () => {

  const usr = getUser(); // fetches user_id from cookies
  const _session = getInitialSession(); // generates an initial object for creating new session
  const deviceData = await getDeviceData()

  if (!getSession() && usr !== null) {
    const locationData = await getLocationByIP()
    const additionalInfo = {
      browser: deviceData?.browser?.name,
      os: deviceData?.os?.name,
      platform: deviceData?.platform?.type,
      location: locationData?.name,
      ip_address: locationData?.data?.ip
    }
    try {
      if (typeof _session === "object") {
        const res = await fetch("/api/track?type=session", {
          method: "POST",
          body: JSON.stringify({ session: { ..._session, ...additionalInfo } }),
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        if (data.error) {
          throw data;
        }
        storeSession(data.id);
        return { session: { id: data.id, ..._session }, sessionId: data.id };
      }
    } catch (error) {
      throw error
    }
  } else {
    return { sessionId: getSession(), session: _session };
  }
};


export const createUser = async (deviceData: any) => {
  try {
    const _user = getUser();

    if (_user === null) {
      const usr = await generateUserData(deviceData);
      const res = await fetch("/api/track?type=user", {
        method: "POST",
        body: JSON.stringify(usr),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.userId) {
        storeUser(data.userId);
        return { id: data.userId, ...usr };
      }
    } else {
      const userData = await getUserData(_user);

      if (userData) {
        return { id: _user, ...userData };
      }
    }
  } catch (error) {
    // Error handled silently
  }
};

export async function getUserData(id: string) {
  try {
    const res = await fetch("/api/track?type=user&id=" + id);

    const data = await res.json();
    return data;
  } catch (error) {
    // Error handled silently
  }
}

// export function useTrac
export const TrackUserContext = createContext<{
  // session: any;
  sessionId: any;
  setSessionId: any,
  setUserId: any
  userId: Partial<IUser>;
  observedUser: any;
  setObservedUser: any
} | null>(null);

export function TrackUserProvider(props: PropsWithChildren) {

  const [sessionId, setSessionId] = useState<string>();
  const [userId, setUserId] = useState<any>();
  const [observedUser, setObservedUser] = useState<any>()
  const router = useRouter();


  const { Track } = useTracking({
    session_id: sessionId,
    user_id: userId,
    internalData: {
      setSessionId, setUserId, setObservedUser,observedUser
    }
  }, {});
  useEffect(() => {
    if (window !== undefined && observedUser) {
      const { domain = "" } = getParams() || { domain: getCookie('domain') || "" };


      if (domain) {
        (observedUser as any).practice_name = domain;
        if (domain.length > 0) storePracticeName(domain)
      }

    }
    // if landing from another website of the same , fetch session and user id from query.
    if (router.query.session) storeSession(router.query.session as string);
    if (router.query.user) storeUser(router.query.user as string);
  }, [router.query, observedUser])

  useEffect(() => {
    if (window !== undefined) {
      setSessionId(getSession()!);
      setUserId(getUser())
    }
  }, [])

  // useEffect(() => {
  //   if (
  //     window !== undefined &&
  //     deviceData !== undefined &&
  //     user.id !== undefined &&

  //   ) {
  //     createSession().then((res) => {
  //       setSession(res?.session);
  //       setSessionId(res?.sessionId);
  //       const observedObject = createObservableObject(
  //         res?.session,
  //         async (prop, val) => {
  //           const userId = getUser();
  //           if (userId !== null) {
  //             await fetch("/api/track?type=session&" + `id=${res?.sessionId}`, {
  //               method: "PATCH",
  //               headers: { "Content-Type": "application/json" },
  //               body: JSON.stringify({
  //                 id: userId,
  //                 [prop]: val,
  //               }),
  //             });
  //           }
  //         }
  //       );
  //       setObservedSession(observedObject);
  //     });
  //   }
  // }, [deviceData, user]);

  return <TrackUserContext.Provider value={
    {
      sessionId,
      setSessionId,
      setUserId,
      observedUser,
      setObservedUser,
      userId
    }
  } >
    <Track>
      {props.children}
    </Track>
  </TrackUserContext.Provider>
}

export const useTrackUser = () => useContext(TrackUserContext)

export const createObservedUser = (data: any) => createObservableObject(data, async (prop, val) => {
  const userId = getUser();
  if (userId !== null) {
    await fetch("/api/track?type=user", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: userId,
        [prop]: val,
      }),
    });
  }
})