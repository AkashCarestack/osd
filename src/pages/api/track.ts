import { NextApiRequest, NextApiResponse } from "next";

import { supabase } from "../../utils/tracker/supabase";

export default async function trackEvents(
  req: NextApiRequest,
  res: NextApiResponse
) {
  
  if (req.headers.host == "osdental.io") {
    if (req.method === "POST") {
      const type = req.query.type;
      switch (type) {
        case "user": {
          try {
            const id = await createUser(req.body);
            return res.json({ userId: id });
          } catch (error) {
            return res.status(500).json({ error: "Error" });
          }
        }
        case "event": {
          try {
            const events = req.body.events;
            await addEvent(events);
            return res.json({ msg: "success" });
          } catch (error) {
            if (error !== null && typeof error === "object") {
              if (
                (error as any)?.details?.includes(
                  `Key is not present in table "sessions".`
                ) ||
                (error as any).code === "22P02"
              ) {
                return res.status(400).json({ error: "session_key_invalid" });
              }
              if (
                (error as any)?.details?.includes(
                  `Key is not present in table "users".`
                ) ||
                (error as any).code === "22P02"
              ) {
                return res.status(400).json({ error: "user_key_invalid" });
              }
            }
            return res.status(500).json({ error: "Error" });
          }
        }
        case "session": {
          try {
            const session = req.body.session;
            const id = await addSession(session);
            return res.json({ id });
          } catch (error) {
            if (error !== null && typeof error === "object") {
              if (
                (error as any)?.details?.includes(
                  `Key is not present in table "users".`
                ) ||
                (error as any).code === "22P02"
              ) {
                return res.status(400).json({ error: "user_key_invalid" });
              }
            }
            return res.status(500).json({ error: "Error" });
          }
        }
        default: {
          return res.send("non-type");
        }
      }
    }
    if (req.method === "PATCH") {
      try {
        const type = req.query.type;
        switch (type) {
          case "session": {
            const id = req.query.id;
            const data = req.body;
            const update = await updateSession(id, data);
            if (update) {
              return res.json({ msg: "success" });
            } else return res.status(500).json({ error: "Error" });
          }
          case "user": {
            const data = req.body;
            const id = await patchUser(data);
            if (typeof id === "string") {
              return res.json({ id: id });
            } else return res.status(500).json({ error: "Error" });
          }
        }
      } catch (error) {
        res.status(500).json({ error: "Error" });
      }
    }
    if (req.method === "GET") {
      const type = req.query.type;
      switch (type) {
        case "user": {
          try {
            const id = req.query.id;
            const query = await supabase.from("users").select("*").eq("id", id);
            return res.json(query.data![0] ?? null);
          } catch (error) {
            return res.json({ error: "Error" });
          }
        }
      }
    }
  } else {
    res.status(403).json({ error: "Forbidden" });
  }
}

async function createUser(data: any) {
  const query = await supabase.from("users").insert(data).select("id");
  if (query.error) {
    throw query.error;
  }
  if (query.data !== null) {
    return query.data[0].id;
  }
}

async function addEvent(data: any) {
  try {
    const res = await supabase.from("events").insert(data);
    if (res.error) throw res.error;
  } catch (error) {
    throw error;
  }
}

async function addSession(data: any) {
  try {
    // if (product.error) throw product.error;
    // if (product.data !== null) {
    const product_id = process.env.CSTRACKER_PRODUCT_ID;
    const res = await supabase
      .from("sessions")
      .insert({ ...data, product_id })
      .select("id");
    if (res.error) {
      throw res.error;
    }
    return res.data![0]?.id;
    // } else {
    //   throw Error("product not found");
    // }
  } catch (error) {
    throw error;
  }
}

async function updateSession(id: any, data: any) {
  const query = await supabase.from("sessions").update(data).eq("id", id);
  if (query.error) throw query.error;
  else return true;
}

async function patchUser(data: any) {
  const query = await supabase
    .from("users")
    .update(data)
    .eq("id", data.id)
    .select("id");
  if (query.error) {
    throw query.error;
  }
  if (query.data !== null) {
    return query.data[0].id;
  }
}
