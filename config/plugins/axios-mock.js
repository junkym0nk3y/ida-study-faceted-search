// Json
import * as projectsData from '../../assets/mockdata/projects';
const [...projects] = projectsData.projects;

// Utils
import {handleSpecs, handleFilters} from '../../assets/js/utils/mock-utils';

export default ({ $axios }) => {
    const MockAdapter = require('axios-mock-adapter');
    const mock = new MockAdapter($axios);

    mock.onGet('/api/projects/')
        .reply(function(config) {
            return [202, config?.params ? handleFilters(projects, config.params) : projects];
        });

    mock.onGet('/api/projects/facets/')
        .reply(function(config) {
            const filtered = config?.params ? handleFilters(projects, config.params) : projects;
            return [202, handleSpecs(filtered)];
        });

    mock.onGet('/api/projects/specs/')
        .reply(function(config) {
            const filtered = config?.params ? handleFilters(projects, config.params) : projects;
            return [202, handleSpecs(filtered, true)];
        });
};
