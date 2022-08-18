<?php
    sleep(5); // Wait for the docker compose to fully be up
    $url = 'http://localhost/install/';

    $dom = load_dom_document($url);

    if ($dom == null){ // Check to make Sure Dom loading was successful
        echo "Loading Install Page Document Failed";
        exit(-1);
    }

    $ids = array("PHP","System_Utilities","Filesystem"); // http://localhost/install/ <ul> id names for the tables

    $docker_success = TRUE;
    foreach($ids as $id){
        $docker_success = check_install_table($dom, $id);
    }

    if ($docker_success == FALSE){
        echo "docker image failed: install page contains failing test",PHP_EOL;
        exit(-2);
    }else{
        echo "success docker image install page was all green lights",PHP_EOL;
    }

    


    function load_dom_document($url){
        try {
            $curl = curl_init();
        
            curl_setopt($curl, CURLOPT_URL, $url);
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($curl, CURLOPT_HEADER, false);
            
            $data = curl_exec($curl); // Grabs WebPage Data

            curl_close($curl);
            $dom = new DOMDocument();
            $dom->loadHTML($data); // Load Web data into DomDocument
        } catch (Exception $e) {
            echo 'Caught exception: ',  $e->getMessage(), PHP_EOL;
            return NULL;
        }
        return $dom;
    }

    function check_install_table($dom, $id){
        try {
            $passed = TRUE;
            $table= $dom->getElementById($id);
            $table_elements = $table->getElementsByTagName("li");
            if ($table_elements->length == 0){
                return False;
            }
            foreach ($table_elements as $li) {
                if ($li->getAttribute('class') == "fail"){
                    $passed = FALSE;
                    echo "failed: ",$li->nodeValue, PHP_EOL;
                }else if ($li->getAttribute('class') == "warn"){
                    echo "warning: ",$li->nodeValue, PHP_EOL;
                }
            }
        } catch (Exception $e) {
            echo 'Caught exception: ',  $e->getMessage(), PHP_EOL;
            return FALSE;
        }
        return $passed;
    }
?>