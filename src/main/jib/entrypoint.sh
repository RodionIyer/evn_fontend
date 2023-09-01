#!/bin/sh
sed -i "s/{MODE}/${MODE}/g" app/resources/application.properties
sed -i "s/{DB_IP}/${DB_IP}/g" app/resources/application.properties
sed -i "s/{DB_NAME}/${DB_NAME}/g" app/resources/application.properties
sed -i "s/{DB_USER}/${DB_USER}/g" app/resources/application.properties
sed -i "s/{DB_PWD}/${DB_PWD}/g" app/resources/application.properties

echo "This is the version of java: $(java -version)"
cat app/resources/application.properties

exec java $JAVA_OPTS -cp $( cat /app/jib-classpath-file ) $( cat /app/jib-main-class-file )