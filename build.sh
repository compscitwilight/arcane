if [ -d bin/view ]
then
    rm -rf bin/view
    echo "Removing existing view output.."
fi

cp -r src/view bin
echo "✓ Moved view source into output.."

echo "TypeScript compilation begin"
tsc -p src/tsconfig.json --outDir bin
echo "✓ TypeScript successfully compiled"

echo "✓ Build completed"
#echo "Run npm run start to run the development build."
electron bin