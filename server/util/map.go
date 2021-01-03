package util

import (
	"encoding/json"
	"reflect"
)

func StructToJsonMap(item interface{}) map[string]interface{} {
	m := map[string]interface{}{}

	v := reflect.ValueOf(item)
	v = reflect.Indirect(v)

	t := reflect.TypeOf(item)
	if t.Kind() == reflect.Ptr {
		t = t.Elem()
	}

	for i := 0; i < t.NumField(); i++ {
		tag := t.Field(i).Tag.Get("json")
		f := v.Field(i).Interface()
		if tag != "" && tag != "-" {
			if t.Field(i).Type.Kind() == reflect.Struct {
				m[tag] = StructToJsonMap(f)
			} else {
				m[tag] = f
			}
		}
	}

	return m
}

func JsonMapToStruct(m interface{}, p interface{}) error {
	t, err := json.Marshal(m)
	if err != nil {
		return err
	}
	return json.Unmarshal(t, p)
}
