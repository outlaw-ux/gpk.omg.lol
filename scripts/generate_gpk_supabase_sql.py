#!/usr/bin/env python3
from __future__ import annotations

import csv
import os
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_SOURCE_CSV = REPO_ROOT / "Garbage Pail Kids Master Collection v2.1 250301 - Cards DB.csv"
SOURCE_CSV = Path(os.environ.get("GPK_SOURCE_CSV", str(DEFAULT_SOURCE_CSV)))
OUTPUT_SQL = REPO_ROOT / "supabase" / "gpk_cards_import.sql"
IMPORT_BATCH = "gpk_master_collection_v2_1_250301"
TABLE_NAME = "public.gpk_cards"


COLUMN_MAP = {
    1: ("set_name", "text", True),
    2: ("set_code", "text", True),
    3: ("set_release_year_month", "text", True),
    4: ("card_number", "text", True),
    5: ("card_name", "text", True),
    6: ("variation", "text", False),
    7: ("artist", "text", False),
    8: ("card_type", "text", True),
    9: ("card_style", "text", True),
    10: ("parallel_base", "text", False),
    11: ("parallel_blk", "text", False),
    12: ("parallel_gra", "text", False),
    13: ("parallel_ylw", "text", False),
    14: ("parallel_blu", "text", False),
    15: ("parallel_red", "text", False),
    16: ("parallel_gre", "text", False),
    17: ("parallel_pur", "text", False),
    18: ("parallel_ora", "text", False),
    19: ("parallel_brz", "text", False),
    20: ("parallel_slv", "text", False),
    21: ("parallel_gld", "text", False),
    22: ("parallel_cya", "text", False),
    23: ("parallel_mag", "text", False),
    24: ("parallel_pnk", "text", False),
    25: ("parallel_tea", "text", False),
    26: ("parallel_aqu", "text", False),
    27: ("parallel_ros", "text", False),
    28: ("parallel_brw", "text", False),
    29: ("parallel_whi", "text", False),
    30: ("feature_foi", "text", False),
    31: ("feature_sep", "text", False),
    32: ("feature_rfr", "text", False),
    33: ("feature_afr", "text", False),
    34: ("feature_xfr", "text", False),
    35: ("feature_pfr", "text", False),
    36: ("feature_wfr", "text", False),
    37: ("feature_kfr", "text", False),
    38: ("feature_dfr", "text", False),
    39: ("feature_nfr", "text", False),
    40: ("feature_sfr", "text", False),
    41: ("feature_ppl", "text", False),
    42: ("feature_skt", "text", False),
    43: ("feature_aut", "text", False),
    44: ("card_rate", "text", False),
    45: ("tags", "text", False),
    46: ("db_id", "text", True),
    47: ("pics", "text", True),
    48: ("collection_base", "smallint", False),
    49: ("collection_parall", "smallint", False),
    50: ("collection_subset", "smallint", False),
    51: ("collection_other", "smallint", False),
    52: ("collection_extra", "smallint", False),
    53: ("more_variations", "text", False),
    54: ("done", "smallint", False),
}


EXPECTED_ROW_2 = [
    "",
    "SET INFORMATION",
    "",
    "",
    "CARD INFORMATION",
    "",
    "",
    "",
    "INSERTS / CHASES",
    "",
    "PARALLELS / BORDER COLORS",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "OTHER FEATURES",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "ADDITIONAL INFO",
    "",
    "",
    "",
    "MY COLLECTION",
    "",
    "",
    "",
    "",
    "",
    "",
]

EXPECTED_ROW_3 = [
    "",
    "SET NAME",
    "CODE",
    "DATE",
    "NUM",
    "CARD NAME",
    "VARIATION",
    "ARTIST",
    "CARD TYPE",
    "CARD STYLE",
    "BASE",
    "BLK",
    "GRA",
    "YLW",
    "BLU",
    "RED",
    "GRE",
    "PUR",
    "ORA",
    "BRZ",
    "SLV",
    "GLD",
    "CYA",
    "MAG",
    "PNK",
    "TEA",
    "AQU",
    "ROS",
    "BRW",
    "WHI",
    "FOI",
    "SEP",
    "RFR",
    "AFR",
    "XFR",
    "PFR",
    "WFR",
    "KFR",
    "DFR",
    "NFR",
    "SFR",
    "PPL",
    "SKT",
    "AUT",
    "RATE",
    "TAGS",
    "DB ID",
    "PICS",
    "BASE",
    "PARALL",
    "SUBSET",
    "OTHER",
    "EXTRA",
    "MORE VARIATIONS",
    "DONE",
]


def sql_literal(value: str, data_type: str) -> str:
    if value == "":
        return "NULL"

    if data_type == "smallint":
        return str(int(value))

    escaped = value.replace("'", "''")
    return f"'{escaped}'"


def batched(items: list[str], size: int) -> list[list[str]]:
    return [items[i : i + size] for i in range(0, len(items), size)]


def main() -> None:
    if not SOURCE_CSV.exists():
        raise SystemExit(f"Source CSV not found: {SOURCE_CSV}")

    with SOURCE_CSV.open(newline="", encoding="utf-8-sig") as handle:
        rows = list(csv.reader(handle))

    if len(rows) < 4:
        raise SystemExit("CSV does not contain enough rows to parse.")

    if rows[1] != EXPECTED_ROW_2 or rows[2] != EXPECTED_ROW_3:
        raise SystemExit("CSV header rows do not match the expected layout.")

    data_rows = rows[3:]

    OUTPUT_SQL.parent.mkdir(parents=True, exist_ok=True)

    data_column_names = [COLUMN_MAP[index][0] for index in COLUMN_MAP]
    column_order = ["import_batch", "source_row", *data_column_names]

    create_columns = [
        "id bigint generated always as identity primary key",
        "import_batch text not null",
        "source_row integer not null",
    ]

    for index in sorted(COLUMN_MAP):
        name, data_type, required = COLUMN_MAP[index]
        not_null = " not null" if required else ""
        create_columns.append(f"{name} {data_type}{not_null}")

    create_columns.append("constraint gpk_cards_import_batch_source_row_key unique (import_batch, source_row)")

    statements: list[str] = []
    statements.append(
        "\n".join(
            [
                "-- Generated from the GPK master collection CSV.",
                "-- Source layout: row 1 blank, row 2 group headers, row 3 column headers, data begins on row 4.",
                f"-- Source file: {SOURCE_CSV}",
                "",
                "begin;",
                "",
                f"create table if not exists {TABLE_NAME} (",
                "  " + ",\n  ".join(create_columns),
                ");",
                "",
            ]
        )
    )

    value_rows: list[str] = []
    for row_number, row in enumerate(data_rows, start=4):
        values = [sql_literal(IMPORT_BATCH, "text"), str(row_number)]
        for index in sorted(COLUMN_MAP):
            _, data_type, _ = COLUMN_MAP[index]
            raw_value = row[index].strip()
            values.append(sql_literal(raw_value, data_type))

        value_rows.append("(" + ", ".join(values) + ")")

    for batch in batched(value_rows, 500):
        statements.append(
            "\n".join(
                [
                    f"insert into {TABLE_NAME} ({', '.join(column_order)})",
                    "values",
                    "  " + ",\n  ".join(batch),
                    "on conflict (import_batch, source_row) do nothing;",
                    "",
                ]
            )
        )

    statements.append(
        "\n".join(
            [
                f"create index if not exists gpk_cards_set_code_idx on {TABLE_NAME} (set_code);",
                f"create index if not exists gpk_cards_db_id_idx on {TABLE_NAME} (db_id);",
                f"create index if not exists gpk_cards_card_name_idx on {TABLE_NAME} (card_name);",
                "",
                "commit;",
                "",
            ]
        )
    )

    OUTPUT_SQL.write_text("\n".join(statements), encoding="utf-8")

    print(f"Wrote {OUTPUT_SQL}")
    print(f"Rows imported: {len(data_rows)}")


if __name__ == "__main__":
    main()
