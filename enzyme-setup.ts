/* tslint:disable:no-empty */
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

jest.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});
