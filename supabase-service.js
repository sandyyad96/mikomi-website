/* ============================================================
   MIKOMI — SUPABASE SERVICE
   Single reusable wrapper around the Supabase client. No other
   file talks to Supabase directly — everyone goes through
   window.MikomiSupabase.
   Requires the Supabase JS UMD build to be loaded first
   (window.supabase.createClient).
   ============================================================ */
(function () {
  "use strict";

  var SUPABASE_URL = "https://epqlokfnljmbwawgmwfr.supabase.co";
  var SUPABASE_KEY = "sb_publishable_qR44D-DAI_D6o2JQW7yNEQ_kzfpNTov";

  console.log("[MikomiSupabase] Project URL:", SUPABASE_URL);
  console.log("[MikomiSupabase] Publishable key (first 20 chars):", SUPABASE_KEY.slice(0, 20));

  var client = null;
  if (window.supabase && typeof window.supabase.createClient === "function") {
    client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  } else {
    console.error("[MikomiSupabase] Supabase JS client failed to load — window.supabase is missing.");
  }

  /* Upserts a lead keyed on the unique `whatsapp` column so the
     same visitor never creates a duplicate row — their record is
     simply updated with the latest name/email/resource. */
  async function saveLead(lead) {
    if (!client) {
      return Promise.reject(new Error("Supabase client unavailable"));
    }

    var payload = {
      name: lead.name,
      whatsapp: lead.whatsapp,
      email: lead.email || null,
      resource_name: lead.resource
    };

    console.log("[MikomiSupabase] Table:", "leads");
    console.log("[MikomiSupabase] Insert payload:", payload);

    const sessionResult = await client.auth.getSession();
    console.log("Session:", sessionResult);

    const userResult = await client.auth.getUser();
    console.log("User:", userResult);

    return client
      .from("leads")
      .insert(payload)
      .then(function (result) {
        console.log("[MikomiSupabase] Full response object:", result);
        if (result.error) {
          console.error(result.error);
          throw result.error;
        }
        return result.data;
      });
  }

  window.MikomiSupabase = { saveLead: saveLead };
})();
