import { Container } from 'inversify';
import { GComponentList } from '../gcomponent/gcomponent-list';
import { StlbIocTypes } from './ioc-types';

const StlbIoc = new Container();
StlbIoc.bind<GComponentList>(StlbIocTypes.GComponentList).to(GComponentList).inSingletonScope();

export { StlbIoc };
