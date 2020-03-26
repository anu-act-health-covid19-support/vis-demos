#!/usr/bin/env python
import json
import datetime

raw_data_file = "../data/raw-data.geojson"
destination_file = "../data/processed-data.geojson"


def read_data(filename):

    with open(filename) as in_f:
        data = json.load(in_f)

    print(f"read geojson data from {filename}")

    return data


def write_data(data, filename):

    with open(filename, "w") as out_f:
        json.dump(data, out_f, sort_keys=True, indent=2)

    print(f"wrote geojson data to {filename}")


def epochs_to_iso8601(data):
    """munge timestamps in-place, from unix epoch timestamps (note, in millis!) to
    a format which will work with `new Date()` in js

    """
    for feature in data["features"]:
        props = feature["properties"]
        props["time"] = datetime.datetime.fromtimestamp(
            props["time"] / 1000 # note: timestamp is in millis
        ).isoformat()


def add_normalised_colour_values(data):
    """add another prop for use with colouring

    this assumes the timestamps are still in unix epoch (i.e. ints)

    """
    epochs = [feature["properties"]["time"] for feature in data["features"]]
    minTs = min(epochs)
    maxTs = max(epochs)

    for feature in data["features"]:
        props = feature["properties"]
        props["colour"] = (props["time"] - minTs)/(maxTs - minTs)


def main():

    data = read_data(raw_data_file)

    # epochs_to_iso8601(data)

    add_normalised_colour_values(data)

    write_data(data, destination_file)


if __name__ == "__main__":
    main()

