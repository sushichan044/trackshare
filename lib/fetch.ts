type FetchSucceedResponse<T> = {
  ok: true
  data: T
  status: number
  raw: Response
  isEmpty: false
}

type FetchFailedResponse = {
  ok: false
  error: string
  status: number
  raw: Response | null
  isEmpty: false
}

type FetchEmptyResponse = {
  ok: true
  data: null
  status: number
  raw: Response
  isEmpty: true
}

export type FetchResponse<T> =
  | FetchSucceedResponse<T>
  | FetchFailedResponse
  | FetchEmptyResponse

export async function doFetch<T>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<FetchResponse<T>> {
  const res = await fetch(input, init)
  if (res.status === 204) {
    return {
      ok: true,
      data: null,
      status: res.status,
      raw: res,
      isEmpty: true,
    }
  }
  const data = await res.json()
  if (res.status !== 200) {
    return {
      ok: false,
      error: data?.error?.message ?? 'Unknown error',
      status: res.status,
      raw: res,
      isEmpty: false,
    }
  }
  return {
    ok: true,
    data: data as T,
    status: res.status,
    raw: res,
    isEmpty: false,
  }
}

export function mergeUrlAndParams(url: string, params: Record<string, string>) {
  const queries = new URLSearchParams(params)
  return `${url}/?${queries.toString()}`
}
