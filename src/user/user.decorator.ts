import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { User } from "./user.entity";

export const AuthUser = createParamDecorator(
    async (data: keyof User, ctx: ExecutionContext) => {
        const user = (ctx.switchToHttp().getRequest<Request>() as any).user as User;
        return data ? user && user[data] : user;
    }
)