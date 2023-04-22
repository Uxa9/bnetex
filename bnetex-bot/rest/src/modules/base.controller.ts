import { ApiError } from './errors/api.error.js';

export class BaseController {
  public req: any = undefined;
  public res: any = undefined;
  public queryParams: any = {} as any;

  constructor(req: any, res: any) {
    this.req = req;
    this.res = res;
    this.queryParams = { ...this.req.query, ...this.req.body, ...this.req.params };
  }

  async call(name: string) {
    try {
      // @ts-ignore
      const result = await this[name]();
      
      try {
        this.res.json(result);
      } catch (e) {
        console.log(e);
      }
    } catch (e) {
      if (e instanceof ApiError) {
        this.res.status(e.code);
        this.res.json({ detail: e.message });
      }
    }
  }
}
