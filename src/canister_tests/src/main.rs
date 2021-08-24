
mod backend;
mod util;

#[tokio::main]
async fn main() {

    let agent = util::build_agent().await;
    /*if backend::test_backend(&agent).await{
        println!("All tests successful ✅");
    } else {
        println!("Fail ❌");
    }*/
}
