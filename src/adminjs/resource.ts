import { Posts } from "src/posts/posts.entity";
import { Components } from "./components";

export const resource = {
    resource: Posts,
    options: {
        properties: {
            description: {
                type: 'string',
                components: {
                    edit: Components.DescriptionTextarea,
                },
            },
        },
    },
}