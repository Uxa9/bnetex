import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ReqUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    console.log(ctx.switchToHttp().getRequest());
    
    return ctx.switchToHttp().getRequest().user;
  }
);
