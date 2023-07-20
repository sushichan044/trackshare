type FetchSucceedResponse<T> = {
  ok: true
  data: T
  status: number
  raw: Response
}

type FetchFailedResponse = {
  ok: false
  error: string
  status: number
  raw: Response | null
}

export type FetchResponse<T> = FetchSucceedResponse<T> | FetchFailedResponse

export async function doFetch<T>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<FetchResponse<T>> {
  const res = await fetch(input, init)
  if (res.status === 204) {
    return {
      ok: false,
      error: res.statusText,
      status: res.status,
      raw: res,
    }
  }
  const data = await res.json()
  if (res.status !== 200) {
    return {
      ok: false,
      error: data?.error?.message ?? 'Unknown error',
      status: res.status,
      raw: res,
    }
  }
  return {
    ok: true,
    data: data as T,
    status: res.status,
    raw: res,
  }
}

export function mergeUrlAndParams(url: string, params: Record<string, string>) {
  const queries = new URLSearchParams(params)
  return `${url}/?${queries.toString()}`
}
