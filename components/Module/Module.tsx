import { memo } from 'react'
import ModuleUI from '../ui/ModuleUI'
import TitleUI from '../ui/TitleUI'

interface IModule {
	title: string;
	moduleList: IModuleList[]
}

interface IModuleList {
	type: IType;
	moduleName: string;
	moduleTitle: string;
	file: string;
}

type IType = "TEST" | "MATERIAL"

const Mobule = memo(({title, moduleList}: IModule) => {
	return (
		<section className='my-24 px-15 max-[1000px]:px-5 max-[400px]:px-3'>
		 <TitleUI title={title} />
		 <ModuleUI moduleList={moduleList} />
		</section>
	)
})

export default Mobule