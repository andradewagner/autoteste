#!/bin/bash
while :
do
	H=$(date +%H%M%S)
	hora=`echo $H|sed 's/^0*//'`

if ((80000 == $hora )); then 

  sleep 1
  npm run android-complex
  npm run oimod

elif (( 83000 == $hora )); then

  sleep 1
  npm run minhaoi

elif (( 120000 == $hora )); then 

  sleep 1
  npm run android-complex
  npm run oimod

elif (( 123000 == $hora )); then

  sleep 1
  npm run minhaoi

elif (( 160000 == $hora )); then

  sleep 1
  npm run android-complex
  npm run oimod

elif (( 163000 == $hora )); then

  sleep 1
  npm run minhaoi

fi

done
