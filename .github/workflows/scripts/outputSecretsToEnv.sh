while read -d $'\t' -r key value; do
  if [[ $key == *$'\n'* ]]; then
    echo $key'<<EOF' >> $GITHUB_ENV
    echo "$value" >> $GITHUB_ENV
    echo 'EOF' >> $GITHUB_ENV
  elif [[ ! -z $key ]]; then
    echo $key'='$value >> $GITHUB_ENV
  fi
done< <(jq -j 'to_entries|.[] | "\(.key) \(.value)\t"' <<< "$secrets")
