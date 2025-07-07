import { Request } from "express";

type RequestWithSession = Request & {session?: SessionData}

export type SessionData = {
    username?: string
    prompt?: string
}

/**
 * Persistent session-based authentication used, e.g., for permission prompts and silent authentication.
 */
export class Session  {
    private readonly req: RequestWithSession

    constructor(req: Request) {
        this.req = req
        if(!this.req.session) this.init()
    }

    // TODO: exp
    init() {
        this.req.session = {}
        return this
    }

    login(username: string) {
        this.req.session.username = username
        return this
    }

    drop() {
        this.req.session = null
        return this
    }
}
