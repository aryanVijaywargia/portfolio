#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
nvm use 22
cd "/Users/aryanvijaywargia/Src code/a_final_new/portfolio"
npx next dev --port 3333
