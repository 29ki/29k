export type JSONValue = string | number | boolean | JSONObject | JSONArray;

export type JSONObject = {
  [key: string]: JSONValue;
};

export type JSONArray = JSONValue[];
