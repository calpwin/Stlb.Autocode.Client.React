import { Container } from 'inversify';
import { GComponentList } from '../gcomponent/gcomponent-list';
import { StlbIocTypes } from './ioc-types';
import { FlexboxAdapterUtil } from '../utils/flexbox-adapter.util';

const StlbIoc = new Container();
StlbIoc.bind<GComponentList>(StlbIocTypes.GComponentList).to(GComponentList).inSingletonScope();
StlbIoc.bind<FlexboxAdapterUtil>(StlbIocTypes.FlexboxAdapterUtil).to(FlexboxAdapterUtil).inSingletonScope();

export { StlbIoc };
