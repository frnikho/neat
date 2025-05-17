export const resultify = async <T>(fn: () => Promise<T>) => {
    try {
        return { ok: true, result: await fn() } as const
    } catch (e) {
        return { ok: false, error: e } as const
    }
}