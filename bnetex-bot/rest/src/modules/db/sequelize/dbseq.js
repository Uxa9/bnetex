import { Sequelize, DataTypes } from "sequelize";
import { Pattern } from "./models/pattern.js";
import { Pair } from './models/pairs.js';
//const config = require("../../../config/config")();

let config = {
  "database": {
    "user" : "mysql",
    "database": "exchange",
    "password": "mysql"
  }
}

const connection__params = {
  database: config.database.database,
  username: config.database.user,
  password: config.database.password,
};

var sequelize = new Sequelize(
  connection__params.database,
  connection__params.username,
  connection__params.password,
  {
    host: connection__params.host,
    dialect: "mysql",
    pool: {
      max: 60,
      min: 0,
      acquire: 30000,
      idle: 10000,
      maxConnections: 100,
      maxIdleTime: 1000,
    },
    logging: false,
  }
);

export const setup = async () => {
  syncAssotiations();

  await sequelize.sync();
};

export const models = {
  Pattern: Pattern(sequelize, DataTypes),
  Pairs: Pair(sequelize, DataTypes),
  // PatternTrigger: require("./models/patternTriggers")(sequelize, DataTypes),    
  // ActiveGroups: require("./models/activeGroups")(sequelize, DataTypes),
  // ActiveGroupTriggers: require("./models/activeGroupTriggers")(sequelize, DataTypes),
  // Rules: require("./models/rules")(sequelize, DataTypes),  
  // PositionEnters:require("./models/PositionEnters")(sequelize, DataTypes),  
  // Position: require("./models/position")(sequelize, DataTypes),
  // Pairs: require("./models/pairs")(sequelize, DataTypes),
  // WeekMatching: require('./models/WeekMatching')(sequelize, DataTypes)
  
  
};

let syncAssotiations = () => {

  

  //this.models.Pattern.hasMany(this.models.PatternConditions);
  //this.models.PatternConditions.belongsTo(this.models.Pattern)

  // this.models.Pattern.hasMany(this.models.PatternTrigger);
  // this.models.PatternTrigger.belongsTo(this.models.Pattern)

  // this.models.Pattern.hasMany(this.models.ActiveGroups);
  // this.models.ActiveGroups.belongsTo(this.models.Pattern)


  // this.models.ActiveGroups.hasMany(this.models.Position);
  // this.models.Position.belongsTo(this.models.ActiveGroups)

  // this.models.ActiveGroups.hasMany(this.models.ActiveGroupTriggers);
  // this.models.ActiveGroupTriggers.belongsTo(this.models.ActiveGroups)
  
  
  // this.models.ActiveGroups.hasMany(this.models.Rules);
  // this.models.Rules.belongsTo(this.models.ActiveGroups)


  models.Pairs.hasMany(models.Pattern);
  models.Pattern.belongsTo(models.Pairs)


  


  // this.models.Position.hasMany(this.models.PositionEnters);

  // this.models.PositionEnters.belongsTo(this.models.Position)


  // this.models.ActiveGroups.hasMany(this.models.PositionEnters);

  // this.models.PositionEnters.belongsTo(this.models.ActiveGroups)

};
