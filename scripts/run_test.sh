# rm -r ${JSPM_ROOT}/temp

DIR=`dirname $0`
TEMP="${JSPM_ROOT}/temp"
OUT="temp/out.js"
# BIN="${JSPM_ROOT}/node_modules/.bin"

if [ -d "$TEMP" ]; then
    rm -r "$TEMP"
fi

mkdir "$TEMP"

bash "${DIR}/transpile.sh" "$1" "$OUT"

node "${TEMP}/out.js"
