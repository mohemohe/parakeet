package util

import (
	"bytes"
	"encoding/base64"
	"encoding/gob"
)

func StructToBytesString(st interface{}) (string, error) {
	var buff bytes.Buffer
	enc := gob.NewEncoder(&buff)
	if err := enc.Encode(st); err != nil {
		return "", err
	}

	return base64.StdEncoding.EncodeToString(buff.Bytes()), nil
}

func BytesStringToStruct(s string, ptr interface{}) error {
	b, err := base64.StdEncoding.DecodeString(s)
	if err != nil {
		return err
	}
	r := bytes.NewReader(b)
	dec := gob.NewDecoder(r)
	if err := dec.Decode(ptr); err != nil {
		return err
	}
	return nil
}