import _ from 'lodash';
import fp from 'lodash/fp';

type normalizeTextType = (text: string) => string;

export default <normalizeTextType>fp.compose(_.upperFirst, _.lowerCase);
