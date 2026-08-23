const cloudfare = async (token: string) => {
  const formData = new FormData();
  formData.append("secret", process.env.CLOUD_SECRET_KEY!);
  formData.append("response", token);

  const result = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      body: formData,
    },
  );
  const isBot = (await result.json()).success;
  return isBot;
};


export default cloudfare
