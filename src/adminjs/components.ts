import { ComponentLoader } from "adminjs";

const componentLoader = new ComponentLoader();

const Components = {
    DescriptionTextarea: componentLoader.add('DescriptionTextarea', './DescriptionTextarea')
}

export { componentLoader, Components };