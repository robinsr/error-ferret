const APPLICATION_JSON = {
  'Content-Type': 'application/json',
};

const getHandledTime = () => ({
  'x-handler-time': new Date().toISOString(),
})

export const respondOK = (payload: unknown, headers: Record<string, string> = {}): Response => {
  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: { ...APPLICATION_JSON, ...headers, ...getHandledTime() },
  });
};

export const respondErr = (error: unknown, status = 400, headers: Record<string, string> = {}): Response => {
  return new Response(JSON.stringify(error), {
    status,
    headers: { ...APPLICATION_JSON, ...headers, ...getHandledTime() },
  });
};
