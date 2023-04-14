export const ErrorResponse = (message: string, status: number) =>
  new Response(
    JSON.stringify({
      code: status,
      message,
    }),
    {
      status,
    },
  );
