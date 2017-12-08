# To create test certs

* generate root cert

	./bin/genRoot.sh

* self sign root

	./bin/selfSignRoot.sh

* generate user or server private key

	./bin/genPrivateKey.sh <username>

* request sign user private key

	./bin/requestSignKey.sh

* sign the user cert, with new root certificate authority created in step 1

	./bin/signKey.sh

* export user cert to p12 for browser

	./bin/exportToP12.sh

