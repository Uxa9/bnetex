import Joi from 'joi';

import j2s from 'joi-to-swagger';

const PatternScheme = {
  scheme: Joi.object().keys({
    status: Joi.boolean().required(),

    LOGICAL_GROUP: Joi.string(),

    WORKING_GROUP: Joi.string(),

    PART_OF_VOLUME: Joi.number(),

    PERCENT_OF_DEPOSIT: Joi.number(),
  }),
};

export const PatternResponse = j2s.default(PatternScheme.scheme);
