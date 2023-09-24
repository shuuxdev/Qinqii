import moment from 'moment';
require('moment/locale/vi');
export function timeSinceCreatedAt(created_at) {
    // Parsing the created_at timestamp
    const createdAtMoment = moment(created_at);

    // Setting the locale to Vietnamese
    createdAtMoment.locale('vi');

    // Getting the current time and set locale to Vietnamese
    const now = moment().locale('vi');

    // Calculating the duration between now and the created_at timestamp
    const duration = moment.duration(now.diff(createdAtMoment));

    // Returning the human-readable duration in Vietnamese
    return duration.humanize(); // "true" adds the equivalent of "ago" in Vietnamese to the result
}